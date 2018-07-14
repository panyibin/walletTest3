//
//  NavigationHelper.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "NavigationHelper.h"
#import "WalletGeneratorViewController.h"
#import "PinCodeViewController.h"
#import "WalletDetailViewController.h"
#import "PayCoinViewController.h"
#import "AddressQRCodeViewController.h"
#import "WalletSeedViewController.h"
#import "PinInputViewController.h"
#import <QRCodeReaderViewController/QRCodeReader.h>
#import <QRCodeReaderViewController/QRCodeReaderViewController.h>

#import "WelcomeViewController.h"
#import "MainTabBarViewController.h"
#import "SideMenuViewController.h"
#import <LGSideMenuController/LGSideMenuController.h>
#import <LGSideMenuController/UIViewController+LGSideMenuController.h>
#import "GeneralWalletGeneratorViewController.h"
#import "GeneralWalletManagerViewController.h"
#import "SubWalletViewController.h"
#import "SendCoinViewController.h"
#import "SupportedWalletTypeManagerViewController.h"

@implementation NavigationHelper

RCT_EXPORT_MODULE()

+ (instancetype)sharedInstance {
  static NavigationHelper *_instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _instance = [[self alloc] init];
  });
  
  return _instance;
}

- (UINavigationController*)rootNavigationController {
  return (UINavigationController*)[UIApplication sharedApplication].delegate.window.rootViewController;
}

RCT_EXPORT_METHOD(showPinCodeViewControllerWithWalletName:(NSString*)walletName seed:(NSString*)seed animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    PinCodeViewController *vc = [[PinCodeViewController alloc] initWithNibName:@"PinCodeViewController" bundle:nil];
    vc.walletName = walletName;
    vc.seed = seed;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showWalletGeneratorViewControllerWithGenerateSeedButton:(BOOL)showGenerateSeedButton animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    WalletGeneratorViewController *vc = [[WalletGeneratorViewController alloc] initWithNibName:@"WalletGeneratorViewController" bundle:nil];
    vc.showGenerateSeedButton = showGenerateSeedButton;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showWalletDetailViewControllerWithWalletModelDict:(NSDictionary*)walletModelDict animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    WalletDetailViewController *vc = [[WalletDetailViewController alloc] initWithNibName:@"WalletDetailViewController" bundle:nil];
    
    vc.walletModelDict = walletModelDict;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showPayCoinViewControllerWithWalletModelDict:(NSDictionary*)walletModelDict animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    PayCoinViewController *vc = [[PayCoinViewController alloc] initWithNibName:@"PayCoinViewController" bundle:nil];
    
    vc.walletModelDict = walletModelDict;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showWalletSeedViewControllerWithWalletModelDict:(NSDictionary*)walletModelDict animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    WalletSeedViewController *vc = [[WalletSeedViewController alloc] init];
    
    vc.walletModelDict = walletModelDict;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showAddressQRCodeViewControllerWithAddress:(NSString*)address animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    AddressQRCodeViewController *vc = [[AddressQRCodeViewController alloc] initWithNibName:@"AddressQRCodeViewController" bundle:nil];
    vc.address = address;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

//samos start
RCT_EXPORT_METHOD(showGeneralWalletGeneratorViewControllerAnimated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    GeneralWalletGeneratorViewController *vc = [GeneralWalletGeneratorViewController new];
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showGeneralWalletManagerViewControllerAnimated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    GeneralWalletManagerViewController *vc = [GeneralWalletManagerViewController new];
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showSubWalletViewController:(NSDictionary*)subWalletModelDict animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    SubWalletViewController *vc = [SubWalletViewController new];
    vc.walletModelDict = subWalletModelDict;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showSupportedWalletTypeViewController:(NSDictionary*)generalWalletModelDict animated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    SupportedWalletTypeManagerViewController *vc = [SupportedWalletTypeManagerViewController new];
    vc.generalWalletModelDict = generalWalletModelDict;
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

//samos end

RCT_EXPORT_METHOD(showQRReaderViewControllerAnimated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    QRCodeReader *reader = [QRCodeReader readerWithMetadataObjectTypes:@[AVMetadataObjectTypeQRCode]];
    
    QRCodeReaderViewController *vc = [QRCodeReaderViewController readerWithCancelButtonTitle:@"Cancel" codeReader:reader startScanningAtLoad:YES showSwitchCameraButton:NO showTorchButton:NO];
    
    __weak QRCodeReaderViewController* weakVC = vc;
    
    [vc setCompletionWithBlock:^(NSString * _Nullable resultAsString) {
      if (!resultAsString) {
        [[self rootNavigationController] popViewControllerAnimated:YES];
      } else {
        NSLog(@"result str:%@", resultAsString);
        [weakVC stopScanning];
        [[self rootNavigationController] popViewControllerAnimated:YES];
        
        NSDictionary * userInfo = @{kUserInfoTargetAddress:resultAsString};
        
        [[NSNotificationCenter defaultCenter] postNotificationName:kGetAddressFromQRCodeNotification object:nil userInfo:userInfo];
      }
    }];
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_EXPORT_METHOD(showQRReaderViewControllerFromSideMenuAnimated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    QRCodeReader *reader = [QRCodeReader readerWithMetadataObjectTypes:@[AVMetadataObjectTypeQRCode]];
    
    QRCodeReaderViewController *vc = [QRCodeReaderViewController readerWithCancelButtonTitle:@"Cancel" codeReader:reader startScanningAtLoad:YES showSwitchCameraButton:NO showTorchButton:NO];
    
    __weak QRCodeReaderViewController* weakVC = vc;
    
    [vc setCompletionWithBlock:^(NSString * _Nullable resultAsString) {
      if (!resultAsString) {
        [[self rootNavigationController] popViewControllerAnimated:YES];
      } else {
        NSLog(@"result str:%@", resultAsString);
        [weakVC stopScanning];
        [[self rootNavigationController] popViewControllerAnimated:NO];


        TransactionModel *transactionModel = [WalletSharedManager parseTransactionUrl:resultAsString];
        
        SendCoinViewController *sendCoinVC = [[SendCoinViewController alloc] initWithTransactionModel:transactionModel];

        [[self rootNavigationController] pushViewController:sendCoinVC animated:YES];
      }
    }];
    
    [[self rootNavigationController] pushViewController:vc animated:animated];
  });
}

RCT_REMAP_METHOD(showPinCodeInputCheckViewControllerWithCloseButton, showPinCodeInputCheckViewControllerWithCloseButton:(BOOL)hasCloseButton resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [NavigationHelper presentPinInputViewControllerWithCloseButton:hasCloseButton animated:YES pinCodeVerifiedBlock:^{
      resolve(@YES);
    }];
  });
}

RCT_EXPORT_METHOD(popViewControllerAnimated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[self rootNavigationController] popViewControllerAnimated:animated];
  });
}

RCT_EXPORT_METHOD(popToRootViewControllerAnimated:(BOOL)animated) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[self rootNavigationController] popToRootViewControllerAnimated:animated];
  });
}

+ (void)presentPinInputViewControllerWithCloseButton:(BOOL)hasCloseButton animated:(BOOL)animated pinCodeVerifiedBlock:(void (^)(void))pinCodeVerifiedBlock {
  
  [[NavigationHelper sharedInstance] presentPinInputViewControllerWithCloseButton:hasCloseButton animated:animated pinCodeVerifiedBlock:pinCodeVerifiedBlock];
}

- (void)presentPinInputViewControllerWithCloseButton:(BOOL)hasCloseButton animated:(BOOL)animated pinCodeVerifiedBlock:(void (^)(void))pinCodeVerifiedBlock{
  PinInputViewController *vc = [PinInputViewController sharedInstance];
  vc.hasCloseButton = hasCloseButton;
  vc.pinCodeVerifiedBlock = pinCodeVerifiedBlock;
  
  [self.rootNavigationController presentViewController:vc animated:animated completion:nil];
}

+ (void)dismissPinInputViewControllerAnimated:(BOOL)animated {
  [[PinInputViewController sharedInstance] dismissViewControllerAnimated:animated completion:nil];
}

- (void)configViewControllersStack {
  NSInteger walletCount = [WalletSharedManager getWalletsCount];
  if(walletCount == 0) {
    [self resetToWelcomePage];
  } else {
    [self resetToMainPage];
  }
}

//swipe back gesture
RCT_EXPORT_METHOD(setSwipeBackGestureEnabled:(BOOL)enabled) {
  [self rootNavigationController].interactivePopGestureRecognizer.enabled = enabled;
}

//welcome page
- (void)resetToWelcomePage {
  WelcomeViewController *welcomeVC = [WelcomeViewController new];
  [self rootNavigationController].viewControllers = @[welcomeVC];
}

- (void)resetToMainPage {
  LGSideMenuController *sideMenuController = [LGSideMenuController new];
  MainTabBarViewController *mainTabBarVC = [MainTabBarViewController new];
  SideMenuViewController *sideMenuVC = [SideMenuViewController new];
  
  sideMenuController.rootViewController = mainTabBarVC;
  sideMenuController.leftViewController = sideMenuVC;
  sideMenuController.leftViewWidth = 300;
  sideMenuController.leftViewPresentationStyle = LGSideMenuPresentationStyleSlideAbove;
//  sideMenuController.leftViewSwipeGestureRange = LGSideMenuSwipeGestureAreaFull;
  sideMenuController.swipeGestureArea = LGSideMenuSwipeGestureAreaFull;
  
  [self rootNavigationController].viewControllers = @[sideMenuController];
}

//mainTabBar page
RCT_EXPORT_METHOD(rn_resetToMainPage) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self resetToMainPage];
  });
}

RCT_EXPORT_METHOD(rn_showSideMenu) {
  dispatch_async(dispatch_get_main_queue(), ^{
    LGSideMenuController *sideMenuController = [self rootNavigationController].viewControllers.firstObject;
    if ([sideMenuController isKindOfClass:[LGSideMenuController class]]) {
      [sideMenuController showLeftViewAnimated:nil];
    }
  });
}

RCT_EXPORT_METHOD(rn_hideSideMenu) {
  dispatch_async(dispatch_get_main_queue(), ^{
    LGSideMenuController *sideMenuController = [self rootNavigationController].viewControllers.firstObject;
    if ([sideMenuController isKindOfClass:[LGSideMenuController class]]) {
      [sideMenuController hideLeftViewAnimated:nil];
    }
  });
}

@end
