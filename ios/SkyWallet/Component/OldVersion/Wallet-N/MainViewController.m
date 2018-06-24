//
//  MainViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MainViewController.h"
#import "WalletGeneratorViewController.h"
#import "PinInputViewController.h"


@interface MainViewController ()
{
  BOOL bFirstShow;
}

@property (nonatomic, strong) RCTRootView *walletView;
@property (nonatomic, strong) NSArray *walletArray;

//used for RN
@property (nonatomic, strong) NSArray *walletJsonArray;
@property (nonatomic, strong) NSString *totalCoinBalance;
@property (nonatomic, strong) NSString *totalHourBalance;

@end

@implementation MainViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
  self.navigationController.navigationBar.hidden = YES;
  
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didNewWalletCreated:) name:kNewWalletCreatedNotification object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didCoinSent:) name:kCoinSentNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveWalletListRefreshNotification:) name:kRefreshWalletListNotification object:nil];
  
  bFirstShow = YES;
  
//  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
//  
//  if (pinCode) {    
//    [NavigationHelper presentPinInputViewControllerWithCloseButton:NO animated:NO];
//  }
}

- (void)viewDidAppear:(BOOL)animated {
  if (bFirstShow) {
    [self refreshPageWithLoading:YES];
    bFirstShow = NO;
  } else {
    [self refreshPageWithLoading:NO];
  }
}

- (void)refreshPageWithLoading:(BOOL)withLoading {
  if(withLoading) {
    [YBLoadingView showInView:self.view];
  }
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [self loadData];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      if(!self.walletArray) {
        WalletGeneratorViewController *vc = [[WalletGeneratorViewController alloc] init];
        vc.needPinCode = YES;
        vc.showGenerateSeedButton = YES;
        
        [[NavigationHelper sharedInstance].rootNavigationController pushViewController:vc animated:NO];
      } else {
        NSDictionary *walletViewProperties = @{
                                               @"totalCoinBalance":self.totalCoinBalance ? : @"",
                                               @"totalHourBalance":self.totalHourBalance ? : @"",
                                               @"data": self.walletJsonArray ? : @[]
                                               };
        if (!self.walletView) {
          self.walletView = [RNManager viewWithModuleName:@"Wallet" initialProperties:walletViewProperties];
          [self.view addSubview:self.walletView];
          [self.walletView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.mas_equalTo(self.view);
          }];
        } else {
          self.walletView.appProperties = walletViewProperties;
        }
      }
      
      if(withLoading) {
        [YBLoadingView dismiss];
      }
      
      [[NSNotificationCenter defaultCenter] postNotificationName:kStopLoadingAnimationNotification object:nil];
    });
  });
}

- (void)loadData {
  self.walletArray = [[WalletManager sharedInstance] getLocalWalletArray];
  
  NSMutableArray *mutableWalletArray = [[NSMutableArray alloc] init];
  float totalCoinBalance = 0;
  float totalHourBalance = 0;
  
  for (WalletModel *wm in self.walletArray) {
    NSDictionary *wmDict = [wm convertToDictionary];
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithDictionary:wmDict];
    
    NSError *error;
    NSString *walletBalance = MobileGetWalletBalance(@"skycoin", wm.walletId, &error);
    if (walletBalance) {
      NSDictionary *balanceDict = [SWUtils dictionaryFromJsonString:walletBalance];
      WalletBalanceModel *wbm = [[WalletBalanceModel alloc] initWithDictionary:balanceDict];
      
      totalCoinBalance += [wbm.balance floatValue];
      totalHourBalance += [wbm.hours floatValue];
      
      NSString *balanceToDisplay = [NSString stringWithFormat:@"%.3f", [wbm.balance floatValue]];
      [dict setObject:balanceToDisplay forKey:@"balance"];
      [mutableWalletArray addObject:dict];
    }
  }
  
  self.walletJsonArray = mutableWalletArray;
  self.totalCoinBalance = [NSString stringWithFormat:@"%.3f", totalCoinBalance];
  self.totalHourBalance = [NSString stringWithFormat:@"%.1f", totalHourBalance];
}

- (NSArray*)getJsonArray {
  NSMutableArray *array = [[NSMutableArray alloc] init];
  for (WalletModel *wm in self.walletArray) {
    NSDictionary *wmDict = [wm convertToDictionary];
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithDictionary:wmDict];
    
    NSError *error;
    NSString *walletBalance = MobileGetWalletBalance(@"skycoin", wm.walletId, &error);
    
    [dict setObject:walletBalance?:@"0" forKey:@"balance"];
    
    [array addObject:dict];
  }
  
  return array;
}

- (void)didNewWalletCreated:(NSNotification*)notification {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self refreshPageWithLoading:YES];
  });
}

- (void)didCoinSent:(NSNotification*)notification {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self refreshPageWithLoading:YES];
  });
}

//called from RN
- (void)didReceiveWalletListRefreshNotification:(NSNotification*)notification {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self refreshPageWithLoading:YES];
  });
}

@end
