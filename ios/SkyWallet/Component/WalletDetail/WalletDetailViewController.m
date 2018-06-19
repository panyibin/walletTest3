//
//  WalletDetailViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WalletDetailViewController.h"

@interface WalletDetailViewController ()
{
  BOOL bFirstShow;
}

@property (nonatomic, strong) RCTRootView *walletDetailView;
@property (nonatomic, strong) WalletModel *walletModel;
@property (nonatomic, strong) NSArray *addressArray;
@property (nonatomic, strong) LoadingView *loadingView;

//used for RN
@property (nonatomic, strong) NSArray *addressJsonArray; //format {"address":"", "balance":""}
@property (nonatomic, strong) NSString *totalCoinBalance;
@property (nonatomic, strong) NSString *totalHourBalance;

@end

@implementation WalletDetailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

  if(self.walletModelDict) {
    self.walletModel = [[WalletModel alloc] initWithDictionary:self.walletModelDict];
  }
  
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didNewAddressesCreated:) name:kNewAddressCreatedNotification object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didCoinSent:) name:kCoinSentNotification object:nil];
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveAddressListRefreshNotification:) name:kRefreshAddressListNotification object:nil];
  
  bFirstShow = YES;
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
  if (withLoading) {
    [YBLoadingView showInView:self.view];
  }
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [self loadData];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      NSDictionary *initialProperties = @{
                                          @"totalCoinBalance":self.totalCoinBalance ? : @"",
                                          @"totalHourBalance":self.totalHourBalance ? : @"",
                                          @"walletModelDict":self.walletModelDict ? : @{},
                                          @"data":self.addressJsonArray ? : @[]
                                          };
      
      if(!self.walletDetailView) {
        self.walletDetailView = [RNManager viewWithModuleName:@"WalletDetail" initialProperties:initialProperties];
        [self.view addSubview:self.walletDetailView];
        [self.walletDetailView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.edges.mas_equalTo(self.view);
        }];
      } else {
        self.walletDetailView.appProperties = initialProperties;
      }
      
      if(withLoading) {
        [YBLoadingView dismiss];
      }
      [[NSNotificationCenter defaultCenter] postNotificationName:kStopLoadingAnimationNotification object:nil];
    });
  });
}

- (void)loadData {
  if(self.walletModel) {
    NSError *error;
    NSString *addressJsonStr = MobileGetAddresses(self.walletModel.walletId, &error);
    NSDictionary *addressDict = [SWUtils dictionaryFromJsonString:addressJsonStr];
    self.addressArray = [addressDict getArrayForKey:@"addresses"];
    
    if(self.addressArray) {
      NSMutableArray *mutableAddressArray = [[NSMutableArray alloc] init];
      
      float totalCoinBalance = 0;
      float totalHourBalance = 0;
      
      for (NSString *address in self.addressArray) {
        WalletBalanceModel *wbm = [[WalletManager sharedInstance] getBalanceOfAddress:address coinType:kCoinTypeSky];
        NSMutableDictionary *mutableAddressDict = [[NSMutableDictionary alloc] init];
        NSString *balanceToDisplay = [NSString stringWithFormat:@"%.3f", [wbm.balance floatValue]];
        
        [mutableAddressDict setObject:address forKey:@"address"];
        [mutableAddressDict setObject:balanceToDisplay forKey:@"balance"];
        
        [mutableAddressArray addObject:mutableAddressDict];
        
        totalCoinBalance += [wbm.balance floatValue];
        totalHourBalance += [wbm.hours floatValue];
      }
      
      self.addressJsonArray = mutableAddressArray;
      self.totalCoinBalance = [NSString stringWithFormat:@"%.3f", totalCoinBalance];
      self.totalHourBalance = [NSString stringWithFormat:@"%.1f", totalHourBalance];
    }
  }
}

- (void)didNewAddressesCreated:(NSNotification*)notification {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self refreshPageWithLoading:YES];
  });
}

- (void)didCoinSent:(NSNotification*)notification {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self refreshPageWithLoading:YES];
  });
}

- (void)didReceiveAddressListRefreshNotification:(NSNotification*)notification {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self refreshPageWithLoading:YES];
  });
}

- (void)loadView {
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  view.backgroundColor = [UIColor whiteColor];
  self.view = view;
}

@end
